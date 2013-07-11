"""
Purpose of this module:

convert this: http://www.youtube.com/watch?v=qggxi0CNt2s
into this: <iframe width="560" height="315" src="//www.youtube.com/embed/qggxi0CNt2s" frameborder="0" allowfullscreen></iframe>

Note that I'm using single quotes for the formatted output

"""
import re

regExp = "(v=|\/)([\w-]+)(&.+)?$"
formatString = "<iframe width='420'height='315' src='//www.youtube.com/embed/' frameborder='0' allowfullscreen></iframe>"


def read_file(file_name):
    f = open(file_name, "r")  # open in read mode
    assert type(f) is file
    data = f.readlines()
    f.close()
    return data

def parse_input(input_string):
    global regExp
    m = re.search(regExp,input_string)
    return m.group(2)

def formatLines(lines):
    global regExp
    
    for line in lines:
        m = re.search(regExp,line)
        parsedString = m.group(2)
        formattedString = re.sub("/embed/", "/embed/" + parsedString, formatString)
        print formattedString


# MAIN
if __name__ == '__main__':
    print "parseEmbed.py"
    formatLines(read_file("youtube.in"))
    print "Done."