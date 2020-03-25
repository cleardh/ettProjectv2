from rest_framework import serializers
from .models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = 'ProfileID', 'user', 'firstName', 'lastName', 'email', 'role', 'job', 'dateHired', 'phone'