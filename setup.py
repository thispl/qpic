from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in qpic/__init__.py
from qpic import __version__ as version

setup(
	name="qpic",
	version=version,
	description="Customization for QPIC",
	author="TEAMPRO",
	author_email="qpic.erp@gmail.com",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
