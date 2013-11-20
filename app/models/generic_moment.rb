class GenericMoment 

  attr_accessor :updated_dt,
                :created_dt,
                :comments,
                :commenting,
                :comments_count,
                :kind_id,
                :kind_color,
                :body,
                :icons,
                :avatars,
                :body_images,
                :body_text,
                :moment_title,
                :extras


  def moment_partial_path
    "moments/generic"
  end

end