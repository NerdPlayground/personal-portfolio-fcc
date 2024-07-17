from django import template

register=template.Library()

@register.filter
def shorten_date(content):
    year,month,day=content.split("-")
    return f"{month}/{year[2:]}"