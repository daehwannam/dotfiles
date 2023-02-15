
import pdb

# Pdb++ install
# pip install git+https://github.com/pdbpp/pdbpp.git

# Pdb++ config example
# https://github.com/pdbpp/pdbpp#configuration-and-customization

class Config(pdb.DefaultConfig):
    sticky_by_default = False

    # enable pygments
    use_pygments = True

    # pygments style
    # https://pygments.org/styles/
    pygments_formatter_class = "pygments.formatters.TerminalTrueColorFormatter"
    # pygments_formatter_kwargs = {"style": "monokai"}
    # pygments_formatter_kwargs = {"style": "paraiso-dark"}
    pygments_formatter_kwargs = {"style": "native"}
    # pygments_formatter_kwargs = {"style": "material"}

    # disable highlight for the current line indicated by an arrow
    highlight = False
