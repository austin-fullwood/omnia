import smtplib
import sys

name = sys.argv[1]
billID = sys.argv[2]
voted = ""
if (sys.argv[3] == "True"):
    voted = "yea"
else:
    voted = "nay"



#pull info for bill here
receiver = "emg412@vt.edu"
sender = "omniaCapstoneProject.com"
server = "smtp.gmail.com"

message = """From: Omnia <omniaCapstoneProject.com>
To: To <sharonjasl@gmail.com>
Subject: Voter Preference Update
Senator,
A constituent in your district, {}, would prefer for you to vote {} on bill {}.
""".format(name, voted, billID)

server = smtplib.SMTP(server, 587)
server.connect("smtp.gmail.com", 587)

server.starttls()
server.login("omniacproject@gmail.com", "Password4!")
server.sendmail(sender, receiver, message)
server.quit()
