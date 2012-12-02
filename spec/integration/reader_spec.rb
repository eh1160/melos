require 'spec_helper'


feature "Reader", js: true do
	before :all do
		@ref = Reference.new("jhn.2.kjv")
		@prev_ref = Reference.new("jhn.1.kjv")
		@next_ref = Reference.new("jhn.3.kjv")
	end
	describe "when signed out" do
		before :all do
			# visit "/sign-out"
		end

		before :each do
			visit bible_path(@ref)
		end

		scenario "selecting verses" do
			# WHen I visit a Bible chapter page
			# Then I should not see the verse actions button
			page.find("li#li_selected_verses").should_not be_visible
			# When I click a verse
			page.find("span.verse.v1").click
			# I should see the selected verses badge
			page.find("li#li_selected_verses").should be_visible
			page.find("sup#verses_selected_count").should have_content("1")
			# And I should see a verse token in the dropdown menu
			page.all("#menu_bookmark ul.reference_tokens li").first.should have_content("John 2:1")
			# When I click a different verse
			page.find("span.verse.v3").click
			# Then I should see the count go u
			page.find("sup#verses_selected_count").should have_content("2")
			# And there should be another token
			page.all("#menu_bookmark ul.reference_tokens li").first.should have_content("John 2:1")
			page.all("#menu_bookmark ul.reference_tokens li").second.should have_content("John 2:3")
			# When I click a previously selected verse to unselect it
			page.find("span.verse.v3").click
			# Then the count should go back down
			page.find("sup#verses_selected_count").should have_content("1")
			page.find("span.verse.v3").click
			page.find("sup#verses_selected_count").should have_content("2")
			page.all("#menu_bookmark ul.reference_tokens li").second.should have_content("John 2:3")
			# When I click a token
			page.all("#menu_bookmark ul.reference_tokens li").second.find("a").click
			# Then it should unselect that verse
			page.find("sup#verses_selected_count").should have_content("1")
			# And the token should disappear
			page.all("#menu_bookmark ul.reference_tokens li").count.should == 1
		end

		scenario "creating a bookmark (and getting redirected)" do
			page.find("span.verse.v1").click
			page.find("#bookmark-pane").find("button[type='submit']").click
			current_path.should == sign_up_path
		end

		scenario "creating a highlight (and getting redirected)" do
			page.find("span.verse.v1").click
			page.find("#highlight_0").click
			current_path.should == sign_up_path
		end
		
		scenario "changing book and chapter" do
			page.find("#menu_book_chapter_trigger").click
			page.find("#menu_book a[data-book='mat']").click
			page.find("ol#chapter_selector li:first a").click
			current_path.should eq bible_path(Reference.new("mat.1.kjv"))
		end

		scenario "filtering books" do
			page.find("#menu_book_chapter_trigger").click
			page.find("div.search input").set("mark")
			page.find("div#menu_book li a", visible: true).text.should eq "Mark"
		end

		scenario "changing version" do
			page.find("a#menu_version_trigger").click
			page.find("div#menu_version tr[data-abbrev='amp'] td a div").click
			current_path.should eq bible_path(Reference.new(@ref.merge(version: "amp")))
		end
	end

	describe "when signed in" do
		before :all do
			# Given I am signed in as "testusercb" with the password "tenders"
			@user = ensure_user
			@auth = Hashie::Mash.new(username: @user.username, password: "tenders")
		end

		describe "with selected verses" do
			before :all do
				hgh = Highlight.for_reference(@ref, auth: @auth)
				hgh.each(&:destroy)

				bkm = @user.bookmarks
				bkm.each do |b|
					b = Bookmark.find(b.id, auth: @auth)
					puts "destryoing #{b.id}"
					puts b.destroy
					puts b.errors.full_messages
				end

			end

			before :each do
				# Given I an on the chapter page for KJV John 2
				visit bible_path(@ref)
				visit "/sign-in"
				page.fill_in "username", with: @user.username # or whoever
				page.fill_in "password", with: "tenders"
				page.find("input[name='commit']").click
				# And I have selected verse 1
				visit bible_path(@ref)
				page.find("span.verse.v1").click
			end

			scenario "highlighting a verse" do

				expect{page.find("#version_primary span.verse.v1.highlighted")}.to raise_exception
				page.find("#highlight_0").click
				page.find("#version_primary span.verse.v1.highlighted").should
			end

			scenario "creating a bookmark" do
				# Bookmark blurb text
				page.find(".widget.bookmarks").should have_content("give you a quick reference")
				page.fill_in "bookmark_title", with: "titlez"
				page.fill_in "bookmark_labels", with: "labelz"
				page.find("#bookmark-pane").find("button[type='submit']").click
				page.find(".widget.bookmarks").should have_content(@ref.merge(verses: [1]).to_s)
				page.find(".widget.bookmarks").should have_content("titlez")
				page.find(".widget.bookmarks").should have_content("labelz")

			end

			scenario "creating a note" do
				page.find("div.widget.parallel_notes").should_not be_visible
				page.find("dt#new_note_modal").click
				sleep 1
				page.find("div.widget.parallel_notes").should be_visible
				page.fill_in "note_title", with: "titlez"
				page.find(".parallel_notes_submit button").click
				# Can't hack wysiwyg for now; checking for "no text" error on note
				current_path.should == notes_path
				page.find("#note_title").value.should eq "titlez"
			end
		end
	end
end
