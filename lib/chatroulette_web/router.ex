defmodule ChatrouletteWeb.Router do
  use ChatrouletteWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, html: {ChatrouletteWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  scope "/", ChatrouletteWeb do
    pipe_through :browser

    get "/", PageController, :home
  end


  scope "/chat", ChatrouletteWeb do
    pipe_through :browser

    get "/", PageController, :chat
  end

  # Other scopes may use custom stacks.
  # scope "/api", ChatrouletteWeb do
  #   pipe_through :api
  # end
end
