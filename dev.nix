{ pkgs, ... }: {
  # https://nix.dev/getting-started/installing-nix#multi-user-installation
  nix.settings.trusted-users = [ "root" "runner" ];

  # You can also install packages from the Nix package repository.
  # For example, to install cowsay, uncomment the following line:
  packages = [
    pkgs.cowsay
    pkgs.sudo
    pkgs.gh
  ];

  # The following options configure the behavior of the Dev Environment.
  # For a full list of options, see https://nix.dev/reference/nix-data-types#trivial-types
  dev.nix = {
    # This setting shows a warning when a package is not of the lastest version.
    # It's useful for keeping your packages up to date.
    show-trace = true;

    # This setting shows a warning when a package has a vulnerability.
    # It's useful for keeping your packages secure.
    vulnerability-check = true;
  };

  # The following options configure the behavior of the extensions.
  # For a full list of options, see https://devenv.sh/reference/options/
  extensions = {
    # The following options configure the behavior of the Language Server Protocol (LSP).
    # For a full list of options, see https://devenv.sh/reference/options/#options-languages
    languages = {
      # This setting enables the TypeScript language server.
      typescript.enable = true;
      # This setting enables the CSS language server.
      css.enable = true;
    };
    # The following options configure the behavior of pre-commit hooks.
    # For a full list of options, see https://devenv.sh/reference/options/#options-pre-commit
    pre-commit = {
      # This setting enables pre-commit hooks.
      enable = true;
      # The following checks are run before each commit.
      # For a full list of checks, see https://pre-commit.com/hooks.html
      settings.hooks = {
        # This setting checks for trailing whitespace.
        trailing-whitespace.enable = true;
        # This setting checks for files that would conflict in case-insensitive filesystems.
        check-case-conflict.enable = true;
        # This setting checks for broken symlinks.
        check-symlinks.enable = true;
        # This setting checks for files with CRLF line endings that are not in `.gitattributes`.
        mixed-line-ending.enable = true;
      };
    };
  };
}
