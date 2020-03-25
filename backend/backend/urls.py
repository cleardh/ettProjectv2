from django.contrib import admin
from django.conf.urls import url, include	
from django.urls import path
from backend.views import home, login
from roles.views import roles_create_view
from jobs.views import jobs_create_view
from userorganization.views import org_create_view
from register.views import profile_create_view
from request.views import requestView, requestListView, approvedRequests, approveRequests
from django.views.generic import TemplateView
from rest_framework import routers

from category.views import CategoryView
from jobs.views import JobView
from organization.views import OrganizationView
from register.views import ProfileView
from request.views import RequestView
from roles.views import RolesView
from userorganization.views import UsrOrgView


urlpatterns = [    
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
    url(r'^$', home),
    url(r'^login/', login),    
    url(r'^register/', profile_create_view),
    #url(r'^roles/', roles_create_view),
    url(r'^jobs/', jobs_create_view, name='jobs_create_view'),
    url(r'^orgcreate/', org_create_view),
    url(r'^request/', requestView),
    #url(r'^requests/', requestListView),    
    url(r'^approved/', approvedRequests, name='approvedRequests'),
    url(r'^approve/(?P<pk>\d+)/$', approveRequests, name='approveRequests'),
    
    url(r'^category/', CategoryView.as_view()),
    url(r'^job/', JobView.as_view()),
    url(r'^organization/', OrganizationView.as_view()),
    url(r'^profiles/', ProfileView.as_view()),
    url(r'^requests/', RequestView.as_view()),
    url(r'^roles/', RolesView.as_view()),
    url(r'^orgs/', UsrOrgView.as_view()),
]