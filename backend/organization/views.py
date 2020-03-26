from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import OrganizationSerializer
from .models import Organization
from django.shortcuts import get_object_or_404
from rest_framework import status

@api_view(['GET'])
def getOrgs(request):
    orgs = Organization.objects.all()
    serializer = OrganizationSerializer(orgs, many=True)
    return Response(serializer.data)

@api_view(['POST'])  
def addOrgs(request):
    serializer = OrganizationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

@api_view(['GET'])
def getOrgsByID(request, pk):
    org = get_object_or_404(Organization, pk=pk)
    serializer = OrganizationSerializer(org)
    return Response(serializer.data)

@api_view(['GET'])
def deleteOrg(request, pk):
    Organization.objects.filter(pk=pk).delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def getOrgByTitle(request, title):        
    org = get_object_or_404(Organization, title=title)
    serializer = OrganizationSerializer(org)
    return Response(serializer.data)

@api_view(['GET'])
def getOrgByHead(request, head):        
    org = get_object_or_404(Organization, head=head)
    serializer = OrganizationSerializer(org)
    return Response(serializer.data)