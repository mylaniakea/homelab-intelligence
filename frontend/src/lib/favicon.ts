interface FaviconOptions {
    criticalCount: number;
    warningCount: number;
    originalFaviconUrl?: string;
}

// Cache the original favicon once loaded
let originalFaviconImage: HTMLImageElement | null = null;
const loadOriginalFavicon = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        if (originalFaviconImage) {
            resolve(originalFaviconImage);
            return;
        }
        const img = new Image();
        img.onload = () => {
            originalFaviconImage = img;
            resolve(img);
        };
        img.onerror = reject;
        img.src = url;
    });
};

// Function to draw the favicon with a badge
export async function updateFaviconBadge(options: FaviconOptions): Promise<string> {
    const { criticalCount, warningCount, originalFaviconUrl = '/vite.svg' } = options;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
        console.warn("Canvas 2D context not available.");
        return originalFaviconUrl;
    }

    // Load the original favicon
    let img: HTMLImageElement;
    try {
        img = await loadOriginalFavicon(originalFaviconUrl);
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);
    } catch (error) {
        console.error("Failed to load original favicon, using blank canvas.", error);
        // Fallback if original favicon fails to load
        canvas.width = 64; // Default size
        canvas.height = 64;
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    const totalUnresolved = criticalCount + warningCount;

    if (totalUnresolved > 0) {
        const badgeSize = Math.max(16, Math.min(canvas.width / 2, 24)); // Dynamic badge size
        const badgeX = canvas.width - badgeSize - 2;
        const badgeY = 2;
        const radius = badgeSize / 2;

        // Determine badge color based on severity
        const badgeColor = criticalCount > 0 ? '#ef4444' : (warningCount > 0 ? '#f59e0b' : '#3b82f6'); // Red, Yellow, Blue
        const textColor = '#ffffff'; // White text

        // Draw badge background
        context.beginPath();
        context.arc(badgeX + radius, badgeY + radius, radius, 0, Math.PI * 2, false);
        context.fillStyle = badgeColor;
        context.fill();

        // Draw badge count
        context.font = `${Math.floor(badgeSize * 0.7)}px Arial`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillStyle = textColor;
        const displayText = totalUnresolved > 99 ? '99+' : totalUnresolved.toString();
        context.fillText(displayText, badgeX + radius, badgeY + radius + 1); // +1 for better vertical alignment
    }

    // Return data URL
    return canvas.toDataURL('image/png');
}

// Initial setup function to get the current favicon (if any) and store it
export function initializeFaviconManager() {
    const link = document.querySelector<HTMLLinkElement>('link[rel*="icon"]') || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';

    // If no existing favicon, append to head
    if (!link.parentNode) {
        document.getElementsByTagName('head')[0].appendChild(link);
    }
    return link;
}
