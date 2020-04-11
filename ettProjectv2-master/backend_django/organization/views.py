from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import OrganizationSerializer, GetOrganizationSerializer
from .models import Organization
from django.shortcuts import get_object_or_404
from rest_framework import status

@api_view(['GET'])
def getAllOrganizations(request):
    orgs = Organization.objects.all()
    serializer = GetOrganizationSerializer(orgs, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getOrganizationByTitle(request, title):        
    org = get_object_or_404(Organization, title=title)
    serializer = GetOrganizationSerializer(org)
    return Response(serializer.data)

@api_view(['POST'])  
def createOrganization(request):
    serializer = OrganizationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

@api_view(['GET'])
def getOrganizationByID(request, pk):
    org = get_object_or_404(Organization, pk=pk)
    serializer = GetOrganizationSerializer(org)
    return Response(serializer.data)

@api_view(['DELETE'])
def deleteOrganizationByID(request, pk):
    Organization.objects.filter(pk=pk).delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def getOrganizationByHead(request, head):    
    org = Organization.objects.filter(head=head)
    serializer = GetOrganizationSerializer(org, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getOrganizationByLevel(request, level):        
    org = Organization.objects.filter(level=level)
    serializer = GetOrganizationSerializer(org, many=True)
    return Response(serializer.data)