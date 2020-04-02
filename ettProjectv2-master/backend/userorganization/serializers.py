from rest_framework import serializers
from .models import UserOrg

class UsrOrgSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserOrg
        fields = 'UserOrgID', 'profile', 'org'
    
class GetUsrOrgSerializer(serializers.ModelSerializer):
    profile = serializers.ReadOnlyField(source='profile.email')
    org = serializers.ReadOnlyField(source='org.title')
    class Meta:
        model = UserOrg
        fields = 'UserOrgID', 'profile', 'org'