module Types
  class SearchResultSetType < BaseObject
    field :recordsTotal, Int, description: "Total results", null: true, hash_key: :recordsTotal
    field :aggs, [AggType], null: true
    field :study_edge, StudyEdgeType, "Return study decorated with navigation cursors for current search", null: true do
      argument :id, String, "When id is null returns first edge in the search results.", required: false
    end

    field :studies, [StudyType], "A set of matching studies", null: false

    def study_edge(id:)
      search_params = context[:search_params]
      search_params[:sorts] = [{ id: :nct_id }] unless search_params[:sorts]
      feed = Feed.new(search_params: search_params)
      feed.study_edge(id)
    end

    def aggs
      object.fetch(:aggs, []).map do |key, val|
        Hashie::Mash.new(
          name: key,
          buckets: val.fetch("buckets", []),
          doc_count_error_upper_bound: val.fetch("doc_count_error_upper_bound", 0),
          sum_other_doc_count: val.fetch("sum_other_doc_count", 0),
        )
      end
    end
  end
end