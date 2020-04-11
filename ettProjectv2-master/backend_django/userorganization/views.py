from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import UsrOrgSerializer, GetUsrOrgSerializer
from .models import UserOrg
from organization.models import Organization
from profile.models import Profile
from django.shortcuts import get_object_or_404
from rest_framework import status

@api_view(['GET'])
def getOrgs(request):
    usrorg = UserOrg.objects.all()
    serializer = GetUsrOrgSerializer(usrorg, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def addUOrgs(request):
    serializer = UsrOrgSerializer(data=request.data)    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)    

@api_view(['DELETE'])
def deleteUOrg(request, pk):
    UserOrg.objects.filter(pk=pk).delete()
    return Response(status=status.HTTP_204_NO_CONTENT)