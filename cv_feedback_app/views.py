from django.shortcuts import render
from django.views.generic import TemplateView
import os
import openai
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

openai.api_key = os.environ.get("OPENAI_API_KEY")

# Create your views here.
class HomePage(TemplateView):
    template_name = 'index.html'