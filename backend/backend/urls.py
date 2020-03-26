from django.contrib import admin
from django.conf.urls import url, include	
from django.urls import path
from backend.views import home, login
from userorganization.views import org_create_view
from request.views import requestView, requestListView, approvedRequests, approveRequests
from django.views.generic import TemplateView
from rest_framework import routers

from category.views import CategoryView, CategoryDetailView, CategoryDetailViewT
from jobs.views import JobView, JobDetailView, JobDetailViewT
from organization.views import OrganizationView
from register.views import ProfileView, ProfileDetailView
from request.views import RequestView
from roles.views import RolesView, RolesDetailView, RolesDetailViewT
from userorganization.views import UsrOrgView


urlpatterns = [    
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
    url(r'^$', home),

    #url(r'^request/', requestView),
    #url(r'^requests/', requestListView),    
    #url(r'^approved/', approvedRequests, name='approvedRequests'),
    #url(r'^approve/(?P<pk>\d+)/$', approveRequests, name='approveRequests'),
    
    url(r'^category/$', CategoryView.as_view()),
    url(r'^category/(?P<pk>\d+)/$', CategoryDetailView.as_view()),
    url(r'^category/(?P<name>.+)/$', CategoryDetailViewT.as_view()),
    
    url(r'^job/$', JobView.as_view()),
    url(r'^job/(?P<pk>\d+)/$', JobDetailView.as_view()),
    url(r'^job/(?P<title>.+)/$', JobDetailViewT.as_view()),

    url(r'^role/$', RolesView.as_view()),
    url(r'^role/(?P<pk>\d+)/$', RolesDetailView.as_view()),
    url(r'^role/(?P<title>.+)/$', RolesDetailViewT.as_view()),

    url(r'^profile/$', ProfileView.as_view()),
    url(r'^profile/(?P<pk>\d+)/$', ProfileDetailView.as_view()),

    url(r'^organization/', OrganizationView.as_view()),    
    url(r'^requests/', RequestView.as_view()),
    url(r'^orgs/', UsrOrgView.as_view()),
]