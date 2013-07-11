"""
Purpose of this module:

convert this: http://www.youtube.com/watch?v=qggxi0CNt2s
into this: <iframe width="560" height="315" src="//www.youtube.com/embed/qggxi0CNt2s" frameborder="0" allowfullscreen></iframe>

Note that I'm using single quotes for the formatted output

"""
import re
import sys

lines = ""
regExp1 = "(?<=v=)[a-zA-Z0-9-_]+(?=&)|(?<=[0-9]/)[^&\n]+|(?<=v=)[^&\n]+"
regExp2 = "(v=|\/)([\w-]+)(&.+)?$"
templateString = "<iframe width='X' height='Y' src='//www.youtube.com/embed/Z' frameborder='0' allowfullscreen></iframe>"
formatString = "<iframe width='420'height='315' src='//www.youtube.com/embed/' frameborder='0' allowfullscreen></iframe>"
replaceDict = { "X" : "420", "Y" : "315", "Z" : "",}    

def read_file(file_name):
    f = open(file_name, "r")  # open in read mode
    assert type(f) is file
    data = f.readlines()
    f.close()
    return data

def multiple_replace(dictParam, text):
    # Create a regular expression  from the dictionary keys
    regex = re.compile("(%s)" % "|".join(map(re.escape, dictParam.keys())))

    # For each match, look-up corresponding value in dictionary
    return regex.sub(lambda mo: dictParam[mo.string[mo.start():mo.end()]], text) 

def print_lines(lines):
    for line in lines :
        assert type(line) is str
        #s = r.readline()
        print line
        

def parse_input1(input_string):
    print "parse_input1()"
    regExp = "(?<=v=)[a-zA-Z0-9-_]+(?=&)|(?<=[0-9]/)[^&\n]+|(?<=v=)[^&\n]+"
    m = re.search(regExp,input_string)
    assert m.group(0) == "gg7vtTCAkbY"
    return m.group(0)
    
def parse_input2(input_string):
    print "parse_input2()"
    regExp = "(v=|\/)([\w-]+)(&.+)?$"
    m = re.search(regExp,input_string)
    assert m.group(0) == "v=gg7vtTCAkbY"
    assert m.group(1) == "v="
    assert m.group(2) == "gg7vtTCAkbY"
    return m.group(2)

def build_output(id_string, template, width, height):
    print "build_output()"
    assert id_string == "gg7vtTCAkbY"
    compareString = "<iframe width='420' height='315' src='//www.youtube.com/embed/gg7vtTCAkbY' frameborder='0' allowfullscreen></iframe>"
    
    replaceDict = {
    "X" : str(width),
    "Y" : str(height),
    "Z" : id_string,
    } 
    
    formattedString = multiple_replace(replaceDict,template)
    assert formattedString == compareString
    print formattedString

def formatLines(lines, replaceDict, regExp):
    print "formatLines()"
    
    for line in lines:
        m = re.search(regExp,line)
        parsedString = m.group(2)
        formattedString = re.sub("/embed/", "/embed/" + parsedString, formatString)
        print formattedString


# MAIN
if __name__ == '__main__':
    print "parseEmbed.py"
    lines = read_file("youtube.in")
    id_string = parse_input1("http://www.youtube.com/watch?v=gg7vtTCAkbY")
    id_string = parse_input2("http://www.youtube.com/watch?v=gg7vtTCAkbY")
    build_output(id_string, templateString, 420, 315)
    formatLines(lines, replaceDict, regExp2)
    print "Done."
