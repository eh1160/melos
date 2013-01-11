require 'spec_helper'

describe "Requesting the Reader (References#show)" do

  before do
    @base_url = "http://www.example.com"
  end

  describe "with an invalid reference" do

    it "should 404 for '/bible/RSV/Ezekiel-8'" do
      get "/bible/RSV/Ezekiel-8"
      response.code.should == "404"
      response.should render_template(:invalid_ref)
    end

    it "should redirect without a chapter" do
      get "/bible/1/jhn"
      response.code.should == "302"
      response.location.should == "#{@base_url}/bible/1/jhn.1.kjv"
    end

  end

  describe "with a valid reference" do

    describe "Get home page" do

      it "should show the landing page for first time users" do
        get "/"
        response.code.should == "200"
        response.should render_template(:home)
      end

      it "should remember your last read reference" do
        url = "/bible/97/jhn.5.msg"
        get(url)
        response.code.should == "200"
        response.should render_template(:show)

        get "/bible"
        response.code.should == "302"
        response.location.should == @base_url + url
      end
    end

    describe "Get public domain version" do

      it "should render the page regardless of copyright details" do

        get "/bible/12/mat.1.asv"
        response.code.should == "200"
        response.should render_template(:show)

      end

    end



  end


end
