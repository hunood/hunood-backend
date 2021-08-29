enum BaseRoute {
    version = '/',
    authentication = '/authentication',
    business = '/business',
    onboarding = '/onboarding',
    user = '/user',
    cep = '/cep'
}

enum Languages {
    portuguese_br = 'pt_br',
    english = 'en',
    spanish = 'es'
}

enum TipoUsuario {
    ADMINISTRADOR = 'Administrador',
    COLABORADOR = 'Colaborador'
}

export {
    Languages,
    BaseRoute,
    TipoUsuario
}