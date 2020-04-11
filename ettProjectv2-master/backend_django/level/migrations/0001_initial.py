# Generated by Django 3.0.4 on 2020-03-29 01:04

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Level',
            fields=[
                ('LevelID', models.AutoField(primary_key=True, serialize=False)),
                ('title', models.CharField(max_length=30, null=True, unique=True)),
            ],
            options={
                'verbose_name_plural': 'Levels',
            },
        ),
    ]