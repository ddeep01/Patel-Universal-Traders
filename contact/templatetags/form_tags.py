from django import template

register = template.Library()


@register.filter(name='add_class')
def add_class(bound_field, css_class):
    """
    Adds CSS classes to a BoundField widget when rendering from templates.
    Usage: {{ form.field|add_class:'my-class another' }}

    This will attempt to preserve existing widget classes by concatenating.
    If anything goes wrong, returns the original bound_field rendering.
    """
    try:
        existing = ''
        # bound_field.field is the underlying Field, its widget may have attrs
        if hasattr(bound_field, 'field') and hasattr(bound_field.field, 'widget'):
            existing = bound_field.field.widget.attrs.get('class', '')
        combined = (existing + ' ' + css_class).strip()
        return bound_field.as_widget(attrs={'class': combined})
    except Exception:
        # Fallback: return the field as-is (will render normally)
        return bound_field
