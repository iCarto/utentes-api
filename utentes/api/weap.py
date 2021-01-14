import datetime
from tempfile import NamedTemporaryFile

import pandas as pd
from pyramid.request import Request
from pyramid.response import FileIter
from pyramid.view import view_config
from sqlalchemy.engine import Engine


@view_config(route_name="api_weap_demand")
def api_weap_demand(request: Request):
    exp_gid = int(request.GET["id"])
    tmp, filename = build_spreadsheet_file(request.db.bind, exp_gid)

    response = request.response
    # https://docs.microsoft.com/es-es/archive/blogs/vsofficedeveloper/office-2007-file-format-mime-types-for-http-content-streaming-2
    response.content_type = (
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )

    response.content_disposition = f"attachment; filename={filename}"
    try:
        response.app_iter = FileIter(tmp)
    except Exception:
        tmp.close()
        # reraise the original exception
        raise

    # It's granted that response will call close on `tmp` so the file will be deleted
    return response


def build_spreadsheet_file(engine: Engine, exp_gid: int):
    df_basin = get_current_basin_demand(engine)
    df_exp = get_new_exp_demand(engine, exp_gid)
    tmp = NamedTemporaryFile(suffix=".xlsx")
    try:
        write_file(tmp, df_basin, df_exp)
    except Exception:
        tmp.close()
        # reraise the original exception
        raise
    return tmp, build_filename(df_exp["exp_id"][0])


def get_current_basin_demand(engine: Engine):
    query = r"""
    WITH
    weap as (
        SELECT
            name as unidade_weap
            , rel_postos as posto
            , geom
        FROM
            cbase.unidades_weap
        WHERE
            rel_postos IS NOT NULL
        ORDER BY
            name
    )
    , act as (
        SELECT
            key as actividade
        FROM
            domains.actividade
        WHERE
            key IS NOT NULL and key != 'Piscicultura' ORDER BY 1
    )
    , agua as (
        SELECT
            key as tipo_agua
        FROM
            domains.licencia_tipo_agua
        WHERE
            key IS NOT NULL ORDER BY 1
    )
    , exps as (
        SELECT
            e.loc_bacia
            , e.loc_posto
            , a.tipo as actividade
            , l.tipo_agua
            , CASE WHEN
                  estado_lic = 'Utente de usos comuns'
              THEN
                  COALESCE(l.c_real_tot, 0)
              ELSE
                  COALESCE(l.c_licencia)
              END AS consumo
            , e.the_geom IS NOT NULL as has_geom
            , ST_Area(ST_Intersection(e.the_geom, weap.geom))
              /
              ST_Area(e.the_geom)
              as porcentaje_exp_en_unidad
            , weap.unidade_weap as unidade_weap_by_geom
        FROM utentes.exploracaos e
        JOIN utentes.actividades a ON e.gid = a.exploracao
        JOIN utentes.licencias l on e.gid = l.exploracao
        LEFT JOIN weap ON ST_Intersects(ST_Centroid(e.the_geom),  weap.geom)
        WHERE
            estado_lic IN ('Licenciada', 'Utente de facto', 'Utente de usos comuns')
            AND loc_bacia = 'Umbelúzi'
    )

    -- FALTARÍA AJUSTAR EL CONSUMO EN FUNCIÓN DEL AREA SI NO USO ST_Centroid.
    -- Si cruzo polígono con polígono pueden salir del JOIN dos filas (unidades) para
    -- las explotaciones que están entre dos
    , grouped_exps as (
        SELECT
            unidade_weap_by_geom, loc_bacia, loc_posto, actividade, tipo_agua, has_geom
            , SUM(consumo) as consumo
        FROM
            exps
        GROUP BY
            unidade_weap_by_geom, loc_bacia, loc_posto, actividade, tipo_agua, has_geom
        ORDER BY
            unidade_weap_by_geom, loc_bacia, loc_posto, actividade, tipo_agua, has_geom
    )
    , to_link as (
        SELECT unidade_weap, 'Umbelúzi' as bacia, posto, actividade, tipo_agua
        FROM weap, act, agua
        ORDER BY unidade_weap, tipo_agua, actividade
    )
    , result AS (
    SELECT
        to_link.unidade_weap
        , to_link.bacia
        , array_to_string(to_link.posto, ' / ') as posto
        -- , string_agg(grouped_exps.loc_posto, ' / ')  as postos_by_geoms
        , to_link.actividade
        , to_link.tipo_agua
        , SUM(COALESCE(grouped_exps.consumo, 0)) as consumo
    FROM
        to_link
    FULL JOIN
        grouped_exps ON (
            -- Si tiene geometría y no está en una unidad_weap o no está en una de las
            -- unidades_weap analizadas (U12..17), esa explotación no será computada
            -- aunque esté en un posto que encaje en la relación unidades_weap - postos
            -- Si no tiene geometría y está en uno de los postos relacionados con
            -- unidades_weap será computada

            (
                NOT grouped_exps.has_geom
                AND to_link.bacia = grouped_exps.loc_bacia
                AND grouped_exps.loc_posto = ANY(posto)
                AND grouped_exps.actividade = to_link.actividade
                AND grouped_exps.tipo_agua = to_link.tipo_agua
            )
            OR
            (
                grouped_exps.has_geom
                AND to_link.unidade_weap = grouped_exps.unidade_weap_by_geom
                AND to_link.bacia = grouped_exps.loc_bacia
                AND grouped_exps.actividade = to_link.actividade
                AND grouped_exps.tipo_agua = to_link.tipo_agua
            )
        )
    WHERE
        -- eliminamos las que no estén en la zona de trabajo
        to_link.unidade_weap IS NOT NULL
    GROUP BY
        -- si no agrupamos aquí, el JOIN anterior creará filas separadas para los
        -- postos de grouped_exps que enganchen con una unidade_weap que contengan
        -- varios postos
        to_link.unidade_weap
        , to_link.bacia, to_link.posto, to_link.actividade, to_link.tipo_agua

    ORDER BY
        to_link.unidade_weap
        , to_link.bacia, to_link.posto, to_link.tipo_agua, to_link.actividade
    )
    -- SELECT * FROM grouped_exps ORDER BY 1, 2, 3, 4
    SELECT * FROM  result;
    ;
    """

    return pd.read_sql_query(query, con=engine)


def get_new_exp_demand(engine: Engine, exp_gid: int):

    query = r"""
        WITH
        weap as (
            SELECT
                name as unidade_weap
                , rel_postos as posto
                , geom
            FROM
                cbase.unidades_weap
            WHERE
                rel_postos IS NOT NULL
            ORDER BY
                name
        )
        SELECT
            CASE WHEN e.the_geom IS NULL
            THEN
                (SELECT unidade_weap FROM weap WHERE e.loc_posto = ANY(posto) LIMIT 1)
            ELSE
                weap.unidade_weap
              END as unidade_weap
            , loc_bacia
            , loc_posto
            , exp_id
            , exp_name
            , tipo
            , lic_nro_sup, tipo_agua_sup, c_soli_tot_sup
            , lic_nro_sub, tipo_agua_sub, c_soli_tot_sub
            -- , e.the_geom IS NOT NULL as has_geom
            -- , ST_Area(ST_Intersection(e.the_geom, weap.geom))
            --   /
            --   ST_Area(e.the_geom)
            --   as porcentaje_exp_en_unidad
        FROM utentes.exploracaos e
        JOIN utentes.actividades a ON a.exploracao = e.gid
        LEFT JOIN LATERAL (
            SELECT lic_nro, tipo_agua, c_soli_tot
            FROM utentes.licencias
            WHERE exploracao = e.gid AND tipo_agua = 'Superficial' LIMIT 1
        ) as lic_sup(lic_nro_sup, tipo_agua_sup, c_soli_tot_sup) ON true
        LEFT JOIN LATERAL (
            SELECT lic_nro, tipo_agua, c_soli_tot
            FROM utentes.licencias
            WHERE exploracao = e.gid AND tipo_agua = 'Subterrânea' LIMIT 1
        ) as lic_sub(lic_nro_sub, tipo_agua_sub, c_soli_tot_sub) ON true
        LEFT JOIN weap ON ST_Intersects(ST_Centroid(e.the_geom),  weap.geom)

        WHERE e.gid = %(gid)s;
        """  # noqa: WPS323

    return pd.read_sql_query(query, con=engine, params={"gid": exp_gid})


def build_filename(exp_id):
    today = datetime.date.today().strftime("%y%m%d")  # noqa: WPS323
    exp_id_sanitized = exp_id.replace("/", "_")
    return f"{today}_demanda_weap_{exp_id_sanitized}.xlsx"


def write_file(tmp, df_basin, df_exp):
    writer = pd.ExcelWriter(tmp)
    df_basin.to_excel(
        writer,
        sheet_name="Explorações_Agregadas",
        index=False,
        header=[
            "Sub-bacia / Unidade WEAP",
            "Bacia",
            "Posto Exploração",
            "Actividade",
            "Tipo Água",
            "Consumo m3/mês",
        ],
    )
    df_exp.to_excel(
        writer,
        sheet_name="Nova_Licenca",
        index=False,
        header=[
            "Sub-bacia / Unidade WEAP",
            "Bacia",
            "Posto Exploração",
            "Número da exploração",
            "Nome da exploração",
            "Actividade",
            "Licença superficial",
            "Tipo Água",
            "Consumo solicitado m3/mês",
            "Licença subterrânea",
            "Tipo Água",
            "Consumo Solicitado m3/mês",
        ],
    )
    writer.save()
    tmp.seek(0)
    return tmp
