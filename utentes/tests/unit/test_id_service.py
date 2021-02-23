from utentes.services import id_service


def test_is_valid_exp_id():
    assert id_service._is_valid_exp_id(r"001/ARAS/2019/CL", "ARAS")
    assert not id_service._is_valid_exp_id(r"001/ARAZ/2019/CL", "ARAS")
    assert id_service._is_valid_exp_id(r"001/ARAZ/2019/CL", "ARAZ")
    assert not id_service._is_valid_exp_id(r"001-ARAS/2019/CL", "ARAS")
    assert not id_service._is_valid_exp_id(r"001-ARAS/2019\CL", "ARAS")
