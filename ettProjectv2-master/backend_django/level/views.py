from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import LevelSerializer
from .models import Level
from django.shortcuts import get_object_or_404
from rest_framework import status

@api_view(['GET'])
def getAllLevels(request):
    lev = Level.objects.all()
    serializer = LevelSerializer(lev, many=True)
    return Response(serializer.data)

@api_view(['POST'])   
def createLevel(request):
    serializer = LevelSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

@api_view(['DELETE'])
def deleteLevelByID(request, pk):
    Level.objects.filter(pk=pk).delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def getLevelByTitle(request, title):        
    lev = get_object_or_404(Level, title=title)
    serializer = LevelSerializer(lev)
    return Response(serializer.data)