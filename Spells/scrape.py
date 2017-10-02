import csv
import requests
from BeautifulSoup import BeautifulSoup
import json
import re
import HTMLParser

h = HTMLParser.HTMLParser()




# https://www.dndbeyond.com/spells/abi-dalzims-horrid-wilting/more-info
# https://www.dndbeyond.com/spells/absorb-elements/more-info
class Spell(object):
		"""docstring for Spell"""
		pass

list_of_spells = []

for x in range(1,23):
	print x
	url = 'https://www.dndbeyond.com/spells?page=' + str(x)
	response = requests.get(url)
	html = response.content

	soup = BeautifulSoup(html)
	table = soup.find('ul', attrs={'class': 'listing listing-rpgspell rpgspell-listing'})
	
	for row in table.findAll('div', attrs={'class': 'info'}):
		spellObj = Spell()
		link_section = '';
		link = row.find('a', attrs={'class': 'link'})
		link_section = link['href']
		# print "\nlink:      " + link_section
		name = row.find('div', attrs={'class': 'row spell-name'})
		component = name.findAll('span')
		# print "name:      " + component[0].text
		n = h.unescape(component[0].text.replace("&euro;", "'"))
		n = re.sub(r'[^\x00-\x7f]',r'', n) 
		# n = n.replace('&rsquo;', '\'').replace('&nbsp;', ' ')
		spellObj.name = n
		# print "school:    " + component[2].text
		spellObj.school = component[2].text
		# print "component: " + component[4].text
		spellObj.components = component[4].text
		level = row.find('div', attrs={'class': 'row spell-level'})
		# print "level:     " + level.span.text
		spellObj.level = level.span.text
		cast_time = row.find('div', attrs={'class': 'row spell-cast-time'})
		# print "cast time: " + cast_time.text
		spellObj.casting_time = cast_time.text
		duration = row.find('div', attrs={'class': 'row spell-duration'})
		# print "duration:  " + duration.text
		spellObj.duration = duration.span.text
		range = row.find('div', attrs={'class': 'row spell-range'})
		# print "range:     " + range.text
		spellObj.range = range.text
		save = row.find('div', attrs={'class': 'row spell-attack-save'})
		# print "save:      " + save.text
		spellObj.save = save.text
		for ritual in row.findAll('i', attrs={'class': 'i-ritual'}):
			spellObj.ritual = "yes"
		for concentration in row.findAll('i', attrs={'class': 'i-concentration'}):
			spellObj.concentration = "yes"
		# -----------------------------------------------------------------
		spell_url = 'https://www.dndbeyond.com' + link_section + '/more-info'
		# print "url:       " + spell_url
		spell_response = requests.get(spell_url)
		spell_html = spell_response.content
		spell_soup = BeautifulSoup(spell_html)
		# print spell_soup.find('div', attrs={'class': 'more-info-body-description'})
		for spell_page in spell_soup.findAll('div', attrs={'class': 'more-info-body-description'}):
			# print "desc:      "
			description = []
			for d in spell_page.findAll('p'):
				desc = h.unescape(d.text.replace("&euro;", "\'"))
				desc = re.sub(r'[^\x00-\x7f]',r'', desc) 
				# desc = desc.replace('&rsquo;', '\'').replace('&nbsp;', ' ')
				description.append('<p>' + desc + '</p>')
			spellObj.desc = ''.join(description)
			# for description in spell_page.findAll('p'):
				# print description
				# spellObj.desc += description
			for materials in spell_page.findAll('span', attrs={'class': 'components-blurb'}):
				m = h.unescape(materials.text.replace("&euro;", "'"))
				m = re.sub(r'[^\x00-\x7f]',r'', m) 
				# m = m.replace('&rsquo;', '\'').replace('&nbsp;', ' ').replace('&euro;', '').replace('&trade;', '')
				spellObj.material = m
		list_of_spells.append(spellObj)

print "\n\n\n"

# for s in list_of_spells:
# 	if hasattr(s, 'desc'):
# 		print s.desc
# print "\n\n\n"

output = []
for s in list_of_spells:
	output.append(s.__dict__)
	# print(s.__dict__)
with open("dndbeyond_spells.json", 'wb') as outfile:
    json.dump(output, outfile)



# json.dumps(result)






#     list_of_cells = []
#     for cell in row.findAll('td'):
#         text = cell.text.replace('&nbsp;', '')
#         list_of_cells.append(text)
#     list_of_rows.append(list_of_cells)

# outfile = open("./inmates.csv", "wb")
# writer = csv.writer(outfile)
# writer.writerow(["Last", "First", "Middle", "Gender", "Race", "Age", "City", "State"])
# writer.writerows(list_of_rows)