from rest_framework import serializers
from .models import UserOrg

class UsrOrgSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserOrg
        fields = 'UserOrgID', 'title', 'user', 'OrgID'