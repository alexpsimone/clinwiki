module Types
  class ShortLinkType < Types::BaseObject
    field :short, String, null: true
    field :long, String, null: true
    field :search_params, SearchParamsType, null:true


    def search_params
      JSON.parse(long).deep_symbolize_keys
    end
  end
end
