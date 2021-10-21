enum BaseRoute {
    version = '/',
    authentication = '/authentication',
    business = '/business',
    onboarding = '/onboarding',
    user = '/user',
    cep = '/cep',
    association = '/association',
    supplier = '/supplier'
}

enum EtapaOnboarding {
    CADASTRO_USUARIO = 0,
    CADASTRO_EMPRESA = 1,
    VERIFICACAO_CODIGO_EMAIL = 2,
    COMPLETO = 3,
    ALTERACAO_SENHA_NOVO_USUARIO = 4,
    VALIDACAO_DADOS_NOVO_USUARIO = 5,
}

enum Languages {
    portuguese_br = 'pt_br',
    english = 'en',
    spanish = 'es'
}

enum TipoUsuario {
    ADMINISTRADOR = 'ADMINISTRADOR',
    COLABORADOR = 'COLABORADOR'
}

enum Generos {
    MASCULINO = "Masculino",
    FEMININO = "Feminino",
    OMITIDO = "Omitir",
    OUTRO = "Outro"
}

enum TratarComo {
    ELE = "Masculino / Ele / Senhor",
    ELA = "Feminino / Ela / Senhora"
}

enum TiposTelefone {
    FIXO = "Telefone",
    CELULAR = "Celular",
    WHATSAPP = "WhatsApp",
    CELULAR_WHATS = "Celular e WhatsApp"
}

export {
    Languages,
    EtapaOnboarding,
    BaseRoute,
    TipoUsuario,
    Generos,
    TratarComo,
    TiposTelefone
}