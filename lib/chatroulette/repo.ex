defmodule Chatroulette.Repo do
  use Ecto.Repo,
    otp_app: :chatroulette,
    adapter: Ecto.Adapters.Postgres
end
