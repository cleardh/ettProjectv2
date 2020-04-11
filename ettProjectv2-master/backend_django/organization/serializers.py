from rest_framework import serializers
from .models import Organization

class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = 'OrganizationID', 'title', 'level', 'head'
    
class GetOrganizationSerializer(serializers.ModelSerializer):
    level = serializers.ReadOnlyField(source='level.title')
    head  = serializers.ReadOnlyField(source='head.email')
    class Meta:
        model = Organization
        fields = 'OrganizationID', 'title', 'level', 'head'