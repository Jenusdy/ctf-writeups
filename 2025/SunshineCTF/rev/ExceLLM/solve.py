import uno
import string

def cell_name_to_indices(cell_name):
    # Assumes cell_name like "H10"
    col = ord(cell_name[0].upper()) - ord('A')
    row = int(cell_name[1:]) - 1
    return col, row

def set_b2_to_s():
    doc = XSCRIPTCONTEXT.getDocument()
    sheet = doc.Sheets.getByName("LLM")
    verify_sheet = doc.Sheets.getByName("VERIFY")
    result = ""
    for cell in ["H10","H30","H50","H70","H90","H110","H130","H150","H170","H190","H210","H230","H250","H270","H290","H310","H330","H350","H370","H390","H410","H430","H450","H470","H490","H510","H530"]:
        col, row = cell_name_to_indices(cell)
        for ch in string.printable:
            temp = result + ch
            sheet.getCellByPosition(1, 1).String = temp  
            if verify_sheet.getCellByPosition(col, row).String == "TRUE":
                result = temp
                break 