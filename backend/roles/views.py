from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import RoleSerializer
from .models import Roles
from django.shortcuts import get_object_or_404
from rest_framework import status

class RolesView(APIView):
    def get(self, request):
        rol = Roles.objects.all()
        serializer = RoleSerializer(rol, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = RoleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

class RolesDetailView(APIView):
    
    def get(self, request, pk):
        rol = get_object_or_404(Roles, pk=pk)
        serializer = RoleSerializer(rol)
        return Response(serializer.data)

    def delete(self, request, pk):
        Roles.objects.filter(pk=pk).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class RolesDetailViewT(APIView):

    def get(self, request, title):        
        role = get_object_or_404(Roles, title=title)
        serializer = RoleSerializer(role)
        return Response(serializer.data)