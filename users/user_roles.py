import types


ROL_ADMIN = "Administrador"
ROL_ADMINISTRATIVO = "Departamento Administrativo"  # DA
ROL_FINANCIERO = "Departamento Financeiro"  # DF
ROL_DIRECCION = "Direcção"
ROL_TECNICO = "Departamento Técnico"
ROL_JURIDICO = "Departamento Jurídico"  # DJ
ROL_OBSERVADOR = "Observador"
ROL_UNIDAD_DELEGACION = "Unidade ou Delegação"
ROL_SINGLE = "ROL_SINGLE"

SINGLE_USER = "SINGLE_USER"


GROUPS_TO_ROLES = types.MappingProxyType(
    {
        ROL_SINGLE: [ROL_SINGLE, ROL_ADMIN],
        ROL_ADMIN: [ROL_ADMIN],
        ROL_ADMINISTRATIVO: [ROL_ADMINISTRATIVO],
        ROL_FINANCIERO: [ROL_FINANCIERO],
        ROL_DIRECCION: [ROL_DIRECCION],
        ROL_TECNICO: [ROL_TECNICO],
        ROL_JURIDICO: [ROL_JURIDICO],
        ROL_OBSERVADOR: [ROL_OBSERVADOR],
        ROL_UNIDAD_DELEGACION: [ROL_UNIDAD_DELEGACION],
    }
)
