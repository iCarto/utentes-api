from tempfile import NamedTemporaryFile
from typing import BinaryIO, Dict

import pandas as pd


def write_tmp_spreadsheet_from_records(_sheets: dict) -> BinaryIO:
    """
    _sheets is a dict where the key is the sheet_name and the value a list of dicts
    where each dict is in the form column_name:value
    """
    sheets = records_to_dataframes(_sheets)
    return write_tmp_spreadsheet_from_dataframes(sheets)


def records_to_dataframes(sheets: Dict) -> Dict:
    return {k: pd.DataFrame.from_records(v) for k, v in sheets.items()}


def write_tmp_spreadsheet_from_dataframes(sheets: Dict) -> BinaryIO:
    """
    sheets is a dict where the key will be the sheet_name in the spreadsheet
    and the value is a dataframe with the data to fill the sheet.
    More that one sheet can be passed in this way
    """
    tmp = NamedTemporaryFile(suffix=".xlsx")

    try:
        write_spreadsheet_from_dataframes(sheets, tmp)
    except Exception:
        tmp.close()
        # reraise the original exception
        raise
    return tmp


def write_spreadsheet_from_dataframes(sheets: dict, file: BinaryIO) -> None:
    """
    Writes the `sheets` dict to `file` like object provided
    The caller has the responsability to open and close the file.
    The `file` argument is `seek(0) to allow return it directly
    """
    writer = pd.ExcelWriter(
        file, date_format="DD/MM/YYYY", datetime_format="DD/MM/YYYY"
    )
    for sheetname, df in sheets.items():
        _write_df_to_sheet(writer, sheetname, df)
        writer.save()
        file.seek(0)


def _write_df_to_sheet(writer, sheet_name: str, df: pd.DataFrame):
    df.to_excel(
        writer,
        sheet_name=sheet_name,
        index=False,
    )
