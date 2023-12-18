import Config

# Configure your database
#
# The MIX_TEST_PARTITION environment variable can be used
# to provide built-in test partitioning in CI environment.
# Run `mix help test` for more information.
config :chatroulette, Chatroulette.Repo,
  username: "postgres",
  password: System.get_env("DB_PASSWORD") || "localhost",
  database: "app_test#{System.get_env("MIX_TEST_PARTITION")}",
  hostname: System.get_env("DB_HOST") || "localhost",
  pool: Ecto.Adapters.SQL.Sandbox,
  database: "chatroulette_test#{System.get_env("MIX_TEST_PARTITION")}",
  pool_size: 10

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :chatroulette, ChatrouletteWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "5bvpyGLrgZhibLaBI1Pio7fAXYpYSXno22wsvsTpZyEhd2d6G804D+cIJ+Hldxl6",
  server: false

# Print only warnings and errors during test
config :logger, level: :warning

# Initialize plugs at runtime for faster test compilation
config :phoenix, :plug_init_mode, :runtime
