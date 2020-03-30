from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import RequestSerializer, GetRequestSerializer
from .models import Request
from profile.models import Profile
from category.models import Category
from profile.serializers import ProfileSerializer
from django.shortcuts import get_object_or_404
from rest_framework import status
import csv
from django.shortcuts import HttpResponse



@api_view(['GET'])
def getRequests(request):
    req = Request.objects.all()
    serializer = GetRequestSerializer(req, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getRequestsByEmail(request, email):
    profile = get_object_or_404(Profile, email=email)
    req = Request.objects.filter(profile=profile.ProfileID)
    serializer = GetRequestSerializer(req, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getConfirmedRequestsByEmail(request, email):
    profile = get_object_or_404(Profile, email=email)
    req = Request.objects.filter(profile=profile.ProfileID, isConfirmed=True)
    serializer = GetRequestSerializer(req, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getConfirmedRequestsByEmailCat(request, email, title):
    profile = get_object_or_404(Profile, email=email)
    category = get_object_or_404(Category, title=title)
    req = Request.objects.filter(isConfirmed=True, profile=profile.ProfileID, category=category.CategoryID)
    serializer = GetRequestSerializer(req, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def createRequest(request):
    serializer = RequestSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

@api_view(['PUT'])
def confirmRequestByID(request, pk):
    req = get_object_or_404(Request, pk=pk)
    req.isConfirmed = True
    req.save()
    serializer = RequestSerializer(instance=req, data=request.data)    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    
@api_view(['DELETE'])
def deleteRequestByID(request, pk):
    Request.objects.filter(pk=pk).delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])    
def getRequestByID(request, pk):
    req = get_object_or_404(Request, pk=pk)
    serializer = GetRequestSerializer(req)
    return Response(serializer.data)

@api_view(['GET'])
def downloadRequests(request):        
    requests = Request.objects.all()
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="requests.csv"'
    writer = csv.writer(response, delimiter=',')
    writer.writerow(['RequestID', 'profile', 'dateS', 'dateE', 'category', 'isConfirmed', 'googleEventID'])
    for obj in requests:
        writer.writerow([obj.RequestID, obj.profile, obj.dateS, obj.dateE, obj.category, obj.isConfirmed, obj.googleEventID])
    return response




