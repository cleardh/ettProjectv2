from rest_framework import serializers
from .models import Profile
from django.contrib.auth.models import User

class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = 'ProfileID', 'user', 'firstName', 'lastName', 'email', 'role', 'job', 'dateHired', 'phone'

class GetProfileSerializer(serializers.ModelSerializer):
    role = serializers.ReadOnlyField(source='role.title')
    job = serializers.ReadOnlyField(source='job.title')
    user = serializers.ReadOnlyField(source='user.first_name')
    class Meta:
        model = Profile
        fields = 'ProfileID', 'user', 'firstName', 'lastName', 'email', 'role', 'job', 'dateHired', 'phone'

