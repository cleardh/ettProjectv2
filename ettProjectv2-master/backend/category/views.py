from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import CategorySerializer
from .models import Category
from django.shortcuts import get_object_or_404

@api_view(['GET'])
def getAllCategories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getCategoryByTitle(request, title):        
    category = get_object_or_404(Category, title=title)
    serializer = CategorySerializer(category)
    return Response(serializer.data)

@api_view(['POST'])
def createCategory(request):
    serializer = CategorySerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

@api_view(['GET'])
def getCategoryByID(request, pk):
    category = get_object_or_404(Category, pk=pk)
    serializer = CategorySerializer(category)
    return Response(serializer.data)

@api_view(['DELETE'])
def deleteCategoryByID(request, pk):
    Category.objects.filter(pk=pk).delete()
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['PUT'])
def updateCategoryByID(request, pk):        
    category = get_object_or_404(Category, pk=pk)
    serializer = CategorySerializer(category, data=request.data)    
    if serializer.is_valid():
        serializer.save()
    return Response(serializer.data)