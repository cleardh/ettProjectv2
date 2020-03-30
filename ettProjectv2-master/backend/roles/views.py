from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import RoleSerializer
from .models import Roles
from django.shortcuts import get_object_or_404
from rest_framework import status

@api_view(['GET'])
def getAllRoles(request):
    rol = Roles.objects.all()
    serializer = RoleSerializer(rol, many=True)
    return Response(serializer.data)

@api_view(['POST'])   
def createRole(request):
    serializer = RoleSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

@api_view(['GET'])
def getRoleByID(request, pk):
    rol = get_object_or_404(Roles, pk=pk)
    serializer = RoleSerializer(rol)
    return Response(serializer.data)

@api_view(['DELETE'])
def deleteRoleByID(request, pk):
    Roles.objects.filter(pk=pk).delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def getRoleByTitle(request, title):        
    role = get_object_or_404(Roles, title=title)
    serializer = RoleSerializer(role)
    return Response(serializer.data)