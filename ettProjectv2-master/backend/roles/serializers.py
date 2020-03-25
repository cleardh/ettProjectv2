from rest_framework import serializers
from .models import Roles

class RoleSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Roles
        fields = ['RoleID', 'title', 'isAdmin']