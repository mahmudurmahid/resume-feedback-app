"""
WSGI config for developer_resume project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/wsgi/
"""

import os

if os.path.exists('env.py'):
    import env

from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'developer_resume.settings')

application = get_wsgi_application()
