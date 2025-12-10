"""
Notification Service
Handles sending alerts through various channels (SMTP, Telegram, ntfy, etc.)
"""
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import httpx
import json
from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)

class NotificationService:
    """Service for sending notifications through configured channels"""

    @staticmethod
    async def send_notification(channel: Dict[str, Any], alert_data: Dict[str, Any]) -> bool:
        """
        Send notification through the specified channel

        Args:
            channel: AlertChannel dict with type and config
            alert_data: Alert information to send

        Returns:
            bool: True if sent successfully, False otherwise
        """
        channel_type = channel.get('channel_type')
        config = channel.get('config', {})

        try:
            if channel_type == 'smtp':
                return await NotificationService._send_smtp(config, alert_data)
            elif channel_type == 'telegram':
                return await NotificationService._send_telegram(config, alert_data)
            elif channel_type == 'ntfy':
                return await NotificationService._send_ntfy(config, alert_data)
            elif channel_type == 'discord':
                return await NotificationService._send_discord(config, alert_data)
            elif channel_type == 'slack':
                return await NotificationService._send_slack(config, alert_data)
            elif channel_type == 'pushover':
                return await NotificationService._send_pushover(config, alert_data)
            elif channel_type == 'gotify':
                return await NotificationService._send_gotify(config, alert_data)
            elif channel_type == 'webhook':
                return await NotificationService._send_webhook(config, alert_data)
            else:
                logger.warning(f"Unknown channel type: {channel_type}")
                return False
        except Exception as e:
            logger.error(f"Failed to send notification via {channel_type}: {e}")
            return False

    @staticmethod
    async def _send_smtp(config: Dict[str, Any], alert_data: Dict[str, Any]) -> bool:
        """Send email via SMTP"""
        try:
            msg = MIMEMultipart()
            msg['From'] = config.get('from_email', 'alerts@homelab.local')
            msg['To'] = config.get('to_emails', '')
            msg['Subject'] = f"[{alert_data['severity'].upper()}] Homelab Alert: {alert_data['message']}"

            body = f"""
Homelab Intelligence Alert

Severity: {alert_data['severity'].upper()}
Server: {alert_data.get('server_name', 'Unknown')}
Message: {alert_data['message']}
Metric Value: {alert_data['metric_value']}
Triggered At: {alert_data['triggered_at']}

---
Homelab Intelligence Hub
            """

            msg.attach(MIMEText(body, 'plain'))

            server = smtplib.SMTP(config.get('smtp_host'), int(config.get('smtp_port', 587)))
            if config.get('use_tls', True):
                server.starttls()

            if config.get('smtp_username') and config.get('smtp_password'):
                server.login(config['smtp_username'], config['smtp_password'])

            server.send_message(msg)
            server.quit()

            logger.info(f"SMTP notification sent successfully")
            return True
        except Exception as e:
            logger.error(f"SMTP error: {e}")
            return False

    @staticmethod
    async def _send_telegram(config: Dict[str, Any], alert_data: Dict[str, Any]) -> bool:
        """Send message via Telegram Bot API"""
        try:
            bot_token = config.get('bot_token')
            chat_id = config.get('chat_id')

            if not bot_token or not chat_id:
                logger.error("Telegram bot_token or chat_id missing")
                return False

            severity_emoji = {
                'critical': '🔴',
                'warning': '🟡',
                'info': '🔵'
            }.get(alert_data['severity'], '⚪')

            message = f"""{severity_emoji} *Homelab Alert*

*Severity:* {alert_data['severity'].upper()}
*Server:* {alert_data.get('server_name', 'Unknown')}
*Message:* {alert_data['message']}
*Value:* {alert_data['metric_value']}

_Triggered at {alert_data['triggered_at']}_
            """

            url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json={
                    'chat_id': chat_id,
                    'text': message,
                    'parse_mode': 'Markdown'
                })

                if response.status_code == 200:
                    logger.info("Telegram notification sent successfully")
                    return True
                else:
                    logger.error(f"Telegram API error: {response.text}")
                    return False
        except Exception as e:
            logger.error(f"Telegram error: {e}")
            return False

    @staticmethod
    async def _send_ntfy(config: Dict[str, Any], alert_data: Dict[str, Any]) -> bool:
        """Send push notification via ntfy"""
        try:
            server_url = config.get('server_url', 'https://ntfy.sh')
            topic = config.get('topic')

            if not topic:
                logger.error("ntfy topic missing")
                return False

            url = f"{server_url.rstrip('/')}/{topic}"

            headers = {
                'Title': f"{alert_data['severity'].upper()}: {alert_data.get('server_name', 'Server')} Alert",
                'Priority': 'high' if alert_data['severity'] == 'critical' else 'default',
                'Tags': alert_data['severity']
            }

            # Add auth if configured
            auth = None
            if config.get('username') and config.get('password'):
                auth = (config['username'], config['password'])

            message = f"{alert_data['message']}\nValue: {alert_data['metric_value']}"

            async with httpx.AsyncClient() as client:
                response = await client.post(
                    url,
                    content=message,
                    headers=headers,
                    auth=auth
                )

                if response.status_code == 200:
                    logger.info("ntfy notification sent successfully")
                    return True
                else:
                    logger.error(f"ntfy API error: {response.text}")
                    return False
        except Exception as e:
            logger.error(f"ntfy error: {e}")
            return False

    @staticmethod
    async def _send_discord(config: Dict[str, Any], alert_data: Dict[str, Any]) -> bool:
        """Send message via Discord webhook"""
        try:
            webhook_url = config.get('webhook_url')

            if not webhook_url:
                logger.error("Discord webhook_url missing")
                return False

            color = {
                'critical': 0xFF0000,  # Red
                'warning': 0xFFFF00,   # Yellow
                'info': 0x0000FF       # Blue
            }.get(alert_data['severity'], 0x808080)

            payload = {
                'embeds': [{
                    'title': f"🚨 Homelab Alert",
                    'description': alert_data['message'],
                    'color': color,
                    'fields': [
                        {'name': 'Severity', 'value': alert_data['severity'].upper(), 'inline': True},
                        {'name': 'Server', 'value': alert_data.get('server_name', 'Unknown'), 'inline': True},
                        {'name': 'Metric Value', 'value': str(alert_data['metric_value']), 'inline': True}
                    ],
                    'timestamp': alert_data['triggered_at']
                }]
            }

            async with httpx.AsyncClient() as client:
                response = await client.post(webhook_url, json=payload)

                if response.status_code in [200, 204]:
                    logger.info("Discord notification sent successfully")
                    return True
                else:
                    logger.error(f"Discord webhook error: {response.text}")
                    return False
        except Exception as e:
            logger.error(f"Discord error: {e}")
            return False

    @staticmethod
    async def _send_slack(config: Dict[str, Any], alert_data: Dict[str, Any]) -> bool:
        """Send message via Slack webhook"""
        try:
            webhook_url = config.get('webhook_url')

            if not webhook_url:
                logger.error("Slack webhook_url missing")
                return False

            color = {
                'critical': 'danger',
                'warning': 'warning',
                'info': 'good'
            }.get(alert_data['severity'], '#808080')

            payload = {
                'attachments': [{
                    'color': color,
                    'title': '🚨 Homelab Alert',
                    'text': alert_data['message'],
                    'fields': [
                        {'title': 'Severity', 'value': alert_data['severity'].upper(), 'short': True},
                        {'title': 'Server', 'value': alert_data.get('server_name', 'Unknown'), 'short': True},
                        {'title': 'Metric Value', 'value': str(alert_data['metric_value']), 'short': True}
                    ],
                    'ts': alert_data.get('timestamp', '')
                }]
            }

            async with httpx.AsyncClient() as client:
                response = await client.post(webhook_url, json=payload)

                if response.status_code == 200:
                    logger.info("Slack notification sent successfully")
                    return True
                else:
                    logger.error(f"Slack webhook error: {response.text}")
                    return False
        except Exception as e:
            logger.error(f"Slack error: {e}")
            return False

    @staticmethod
    async def _send_pushover(config: Dict[str, Any], alert_data: Dict[str, Any]) -> bool:
        """Send push notification via Pushover"""
        try:
            user_key = config.get('user_key')
            api_token = config.get('api_token')

            if not user_key or not api_token:
                logger.error("Pushover user_key or api_token missing")
                return False

            priority = 1 if alert_data['severity'] == 'critical' else 0

            payload = {
                'token': api_token,
                'user': user_key,
                'title': f"{alert_data['severity'].upper()}: {alert_data.get('server_name', 'Server')} Alert",
                'message': f"{alert_data['message']}\nValue: {alert_data['metric_value']}",
                'priority': priority
            }

            async with httpx.AsyncClient() as client:
                response = await client.post('https://api.pushover.net/1/messages.json', data=payload)

                if response.status_code == 200:
                    logger.info("Pushover notification sent successfully")
                    return True
                else:
                    logger.error(f"Pushover API error: {response.text}")
                    return False
        except Exception as e:
            logger.error(f"Pushover error: {e}")
            return False

    @staticmethod
    async def _send_gotify(config: Dict[str, Any], alert_data: Dict[str, Any]) -> bool:
        """Send push notification via Gotify"""
        try:
            server_url = config.get('server_url')
            app_token = config.get('app_token')

            if not server_url or not app_token:
                logger.error("Gotify server_url or app_token missing")
                return False

            priority = 8 if alert_data['severity'] == 'critical' else 5

            payload = {
                'title': f"{alert_data['severity'].upper()}: {alert_data.get('server_name', 'Server')} Alert",
                'message': f"{alert_data['message']}\nValue: {alert_data['metric_value']}",
                'priority': priority
            }

            url = f"{server_url.rstrip('/')}/message?token={app_token}"

            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=payload)

                if response.status_code == 200:
                    logger.info("Gotify notification sent successfully")
                    return True
                else:
                    logger.error(f"Gotify API error: {response.text}")
                    return False
        except Exception as e:
            logger.error(f"Gotify error: {e}")
            return False

    @staticmethod
    async def _send_webhook(config: Dict[str, Any], alert_data: Dict[str, Any]) -> bool:
        """Send notification via generic webhook"""
        try:
            url = config.get('url')
            method = config.get('method', 'POST').upper()

            if not url:
                logger.error("Webhook URL missing")
                return False

            headers = {}
            if config.get('headers'):
                try:
                    headers = json.loads(config['headers'])
                except:
                    logger.warning("Failed to parse webhook headers JSON")

            async with httpx.AsyncClient() as client:
                if method == 'POST':
                    response = await client.post(url, json=alert_data, headers=headers)
                else:
                    response = await client.get(url, params=alert_data, headers=headers)

                if response.status_code in [200, 201, 202, 204]:
                    logger.info("Webhook notification sent successfully")
                    return True
                else:
                    logger.error(f"Webhook error: {response.status_code} - {response.text}")
                    return False
        except Exception as e:
            logger.error(f"Webhook error: {e}")
            return False
