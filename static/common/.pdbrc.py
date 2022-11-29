
import pdb

# Pdb packages
#
# pip install ipdb
# pip install git+https://github.com/pdbpp/pdbpp.git

# Pdb++ config
# https://github.com/pdbpp/pdbpp#configuration-and-customization
class Config(pdb.DefaultConfig):
    sticky_by_default = True

    use_pygments = True

    # https://stackoverflow.com/a/3489273
    pygments_formatter_class = "pygments.formatters.TerminalTrueColorFormatter"
    pygments_formatter_kwargs = {"style": "monokai"}
