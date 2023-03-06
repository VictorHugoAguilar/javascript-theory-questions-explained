# Styles

# Introducción

La plantilla de su componente se representa en su raíz oculta. Los estilos que agrega a su componente se limitan automáticamente a la raíz oculta y solo afectan a los elementos de la raíz oculta del componente.

Shadow DOM proporciona una fuerte encapsulación para el estilo. Si Lit no usara Shadow DOM, tendría que tener mucho cuidado de no diseñar accidentalmente elementos fuera de su componente, ya sean ancestros o hijos de su componente. Esto podría implicar escribir nombres de clase largos y engorrosos. Al usar Shadow DOM, Lit garantiza que cualquier selector que escriba solo se aplique a los elementos en la raíz de sombra de su componente Lit.

