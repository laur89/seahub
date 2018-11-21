# -*- coding: utf-8 -*-
# Generated by Django 1.11.15 on 2018-11-20 02:59
from __future__ import unicode_literals

from django.db import migrations
import seahub.base.fields


class Migration(migrations.Migration):

    dependencies = [
        ('drafts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='draftreview',
            name='author',
            field=seahub.base.fields.LowerCaseCharField(db_index=True, default='', max_length=255),
            preserve_default=False,
        ),
    ]
