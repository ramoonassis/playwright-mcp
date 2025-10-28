import pytest
from playwright.sync_api import expect

@pytest.mark.e2e
def test_home(page):
    page.goto('https://testbeyond.com')
    expect(page).to_have_title('Projeto TestBeyond')

