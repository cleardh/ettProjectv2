from rest_framework import serializers
from .models import Jobs

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Jobs
        fields = 'JobID', 'title'