import time
import unittest

from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.select import Select
from selenium.webdriver.support.ui import WebDriverWait

import config
from base import BaseE2ETest


def login(browser, user):
    browser.get(config.HOST_BASE + "/logout")

    browser.get(config.HOST_BASE + "/login")
    userbox = browser.find_element_by_name("user")
    userbox.send_keys(user["name"])
    passbox = browser.find_element_by_name("passwd")
    passbox.send_keys(user["passwd"])
    browser.find_element_by_name("submit").click()


class TestRenovacaoHappyPath(BaseE2ETest):
    def test_renovacao_happy_path(self):
        login(self.browser, {"name": "test_admin", "passwd": "test_admin"})

        self.browser.get(
            config.HOST_BASE
            + f"/exploracao-show.html?id={self.testing_database.test_e.gid}"
        )

        wait = WebDriverWait(self.browser, 60)
        # it will wait for 250 seconds an element to come into view, you can change the
        wait.until(
            EC.element_to_be_clickable(
                (By.CSS_SELECTOR, ".begin-edition-toolbar a:first-of-type")
            )
        ).click()
        wait.until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, ".add-coordinates-icon"))
        ).click()
        csv = """
        001,35.489278,-23.805361
        002,35.538273,-23.796835
        003,35.594005,-22.948001
        004,35.469579,-22.121672
        005,35.458811,-21.674323
        006,32.983946,-25.975704
        007,32.133962,-26.834848
        008,31.310342,-22.422241
        009,34.921381,-21.070397
        """
        lines = [l.strip() for l in csv.split("\n") if l.strip()]
        for line in lines:
            values = [v.strip().replace(".", ",") for v in line.split(",") if v.strip()]
            self.fill_coordinates_and_make_zoom("4326", *values)

        csv = """
        001,753620.621087,7365097.705650
        002,758631.577065,7365953.792310
        003,766002.972855,7459887.606380
        004,754750.898566,7551637.201260
        005,754433.187954,7601203.028790
        006,498393.036942,7127006.664740
        007,413948.747942,7031563.028720
        008,326095.078128,7519457.409850
        009,699621.012946,7668857.637620
        """
        lines = [l.strip() for l in csv.split("\n") if l.strip()]
        for line in lines:
            values = [v.strip().replace(".", ",") for v in line.split(",") if v.strip()]
            self.fill_coordinates_and_make_zoom("32736", *values)

        csv = """
        001,142233.709776,7362894.543010
        002,147207.707092,7363962.545890
        003,150670.678553,7458184.880630
        004,135732.370289,7549475.702950
        005,133475.954495,7599033.279460
        006,-102883.599900,7113109.959720
        007,-183182.230010,7013319.710080
        008,-293061.060910,7500052.623450
        009,76045.732836,7664629.950410
        """
        lines = [l.strip() for l in csv.split("\n") if l.strip()]
        for line in lines:
            values = [v.strip().replace(".", ",") for v in line.split(",") if v.strip()]
            self.fill_coordinates_and_make_zoom("32737", *values)

        time.sleep(1)

    def fill_coordinates_and_make_zoom(self, org_srs, coord_label, org_x, org_y):
        time.sleep(1)

        org_srs_widget = Select(
            self.browser.find_element_by_xpath("//select[@id='org_srs']")
        )
        org_x_widget = self.browser.find_element_by_id("org_x")
        org_y_widget = self.browser.find_element_by_id("org_y")
        coord_label_widget = self.browser.find_element_by_id("coord_label")
        zoom_to_point_widget = self.browser.find_element_by_id("zoom_to_point")
        helpblock_coordinates_widget = self.browser.find_element_by_id(
            "helpBlock_coordinates"
        )

        org_srs_widget.select_by_value(org_srs)
        org_x_widget.clear()
        org_x_widget.send_keys(org_x)
        org_y_widget.clear()
        org_y_widget.send_keys(org_y)
        coord_label_widget.clear()
        coord_label_widget.send_keys(coord_label)
        zoom_to_point_widget.click()
        time.sleep(1)
        self.assertFalse(
            helpblock_coordinates_widget.text,
            f"{org_srs}, {coord_label}, {org_x}, {org_y}",
        )


if __name__ == "__main__":
    unittest.main()
