from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import ProfileSerializer
from .models import Profile
from django.shortcuts import get_object_or_404
from rest_framework import status


class ProfileView(APIView):
    def get(self, request):
        prof = Profile.objects.all()
        serializer = ProfileSerializer(prof, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

class ProfileDetailView(APIView):
    
    def get(self, request, pk):
        prof = get_object_or_404(Profile, pk=pk)
        serializer = ProfileSerializer(prof)
        return Response(serializer.data)