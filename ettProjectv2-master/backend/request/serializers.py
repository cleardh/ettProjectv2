from rest_framework import serializers
from .models import Request

class RequestSerializer(serializers.ModelSerializer):
    isConfirmed = serializers.BooleanField()
    class Meta:
        model = Request
        fields = 'RequestID', 'profile', 'dateS', 'dateE', 'category', 'isConfirmed'

class GetRequestSerializer(serializers.ModelSerializer):
    profile = serializers.ReadOnlyField(source='profile.email')
    category = serializers.ReadOnlyField(source='category.title')
    class Meta:
        model = Request
        fields = 'RequestID', 'profile', 'dateS', 'dateE', 'category', 'isConfirmed'