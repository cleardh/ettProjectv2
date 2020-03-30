from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import ProfileSerializer, GetProfileSerializer
from .models import Profile
from django.shortcuts import get_object_or_404
from rest_framework import status
from django.contrib.auth.models import User


@api_view(['GET'])
def getAllUsers(request):
    prof = Profile.objects.all()
    serializer = GetProfileSerializer(prof, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getUserByEmail(request, email):        
    profile = get_object_or_404(Profile, email=email)
    serializer = GetProfileSerializer(profile)
    return Response(serializer.data)

@api_view(['POST'])
def createUser(request):
    serializer = ProfileSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

@api_view(['PUT'])
def updateUserByID(request, pk):
    prof = get_object_or_404(Profile, pk=pk)
    serializer = ProfileSerializer(prof, data=request.data)
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)

@api_view(['GET'])
def getUserByID(request, pk):
    prof = get_object_or_404(Profile, pk=pk)
    serializer = GetProfileSerializer(prof)
    return Response(serializer.data)

@api_view(['DELETE'])
def deleteUser(request, pk):    
    prof = Profile.objects.get(pk=pk)
    user = User.objects.get(email=prof.user.email)
    prof.delete()
    user.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def getCurrentUser(request):
        user = request.user
        profile = get_object_or_404(Profile, email=user.email)        
        serializer = GetProfileSerializer(profile)
        return Response(serializer.data)